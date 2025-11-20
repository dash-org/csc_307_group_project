// kitchen-auth.js
import memberServices from './services/member-services.js';

// Get user's role in a kitchen
export async function getUserKitchenRole(userId, kitchenId) {
  try {
    const memberships = await memberServices.getMembersByKitchenId(kitchenId);
    const userMembership = memberships.find(
      (m) => m.userId.toString() === userId.toString()
    );
    return userMembership ? userMembership.role : null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

// Users can only access their own user data
export async function authorizeSelfOnly(req, res, next) {
  const targetUserId = req.params.userId || req.params.id;
  const requesterId = req.userId;

  if (targetUserId !== requesterId.toString()) {
    return res.status(403).send('You can only access your own user data');
  }

  next();
}

// Owners and admins can create memberships
// Owners can assign admin, editor, or viewer roles
// Admins can only assign editor or viewer roles
// No one can create owner memberships
export async function authorizeMembershipCreation(req, res, next) {
  const { kitchenId, role: targetRole } = req.body;
  const requesterId = req.userId;

  if (!kitchenId || !targetRole) {
    return res.status(400).send('Missing required fields: kitchenId or role');
  }

  // Owner memberships cannot be created
  if (targetRole === 'owner') {
    return res
      .status(403)
      .send('Owner memberships cannot be created through this endpoint');
  }

  try {
    const requesterRole = await getUserKitchenRole(requesterId, kitchenId);

    if (!requesterRole) {
      return res.status(403).send('You must be a member of this kitchen');
    }

    if (requesterRole === 'owner') {
      return next();
    }

    if (requesterRole === 'admin') {
      if (targetRole === 'admin') {
        return res
          .status(403)
          .send(
            'Admins cannot create admin memberships. Only owners can assign admin role.'
          );
      }
      return next();
    }

    return res
      .status(403)
      .send('Only kitchen owners and admins can create memberships');
  } catch (error) {
    console.error('Authorization error:', error);
    return res.status(500).send('Error checking permissions');
  }
}

// Owners can delete any membership except their own owner membership
// Admins can delete editor and viewer memberships
// Users can delete their own membership unless they are the owner
export async function authorizeMembershipDeletion(req, res, next) {
  const membershipId = req.params.id;
  const requesterId = req.userId;

  try {
    const membership = await memberServices.findMemberById(membershipId);
    if (!membership) {
      return res.status(404).send('Membership not found');
    }

    const kitchenId = membership.kitchenId;
    const targetUserId = membership.userId.toString();
    const targetRole = membership.role;

    // Owners cannot delete their own owner membership
    if (targetRole === 'owner') {
      return res
        .status(403)
        .send(
          'Owner membership cannot be deleted. Delete the kitchen instead.'
        );
    }

    const requesterRole = await getUserKitchenRole(requesterId, kitchenId);

    if (requesterRole === 'owner') {
      return next();
    }

    // Users can delete their own membership
    if (targetUserId === requesterId.toString()) {
      return next();
    }

    if (requesterRole === 'admin') {
      if (targetRole === 'admin') {
        return res
          .status(403)
          .send('Admins cannot delete admin memberships. Only owners can.');
      }
      return next();
    }

    return res
      .status(403)
      .send('You do not have permission to delete this membership');
  } catch (error) {
    console.error('Authorization error:', error);
    return res.status(500).send('Error checking permissions');
  }
}

// Role hierarchy from lowest to highest
const roleHierarchy = {
  viewer: 0,
  editor: 1,
  admin: 2,
  owner: 3,
};

// General authorization function that checks minimum required role
export function authorizeMinRole(minRole) {
  return async (req, res, next) => {
    const kitchenId = req.params.kitchenId || req.params.id;
    const requesterId = req.userId;

    try {
      const requesterRole = await getUserKitchenRole(requesterId, kitchenId);

      if (!requesterRole) {
        return res.status(403).send('You must be a member of this kitchen');
      }

      const requesterLevel = roleHierarchy[requesterRole];
      const requiredLevel = roleHierarchy[minRole];

      if (requesterLevel >= requiredLevel) {
        return next();
      }

      return res.status(403).send(`You must be at least a ${minRole}`);
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).send('Error checking permissions');
    }
  };
}
