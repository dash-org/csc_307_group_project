// kitchen-authorization.js
import memberServices from './services/member-services.js';
import kitchenServices from './services/kitchen-services.js';

// Check if user owns the kitchen
export async function isKitchenOwner(userId, kitchenId) {
  try {
    const kitchen = await kitchenServices.findKitchenById(kitchenId);
    if (!kitchen) {
      return false;
    }
    return kitchen.owner._id.toString() === userId.toString();
  } catch (error) {
    console.error('Error checking kitchen owner:', error);
    return false;
  }
}

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

// Owners and admins can create memberships
// Owners can assign any role
// Admins can only assign editor or viewer roles
export async function authorizeMembershipCreation(req, res, next) {
  const { kitchenId, role: targetRole } = req.body;
  const requesterId = req.userId;

  if (!kitchenId || !targetRole) {
    return res.status(400).send('Missing required fields: kitchenId or role');
  }

  try {
    const kitchen = await kitchenServices.findKitchenById(kitchenId);
    if (!kitchen) {
      return res.status(404).send('Kitchen not found');
    }

    const isOwner = kitchen.owner._id.toString() === requesterId.toString();

    if (isOwner) {
      return next();
    }

    const requesterRole = await getUserKitchenRole(requesterId, kitchenId);

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

// Owners can delete any membership
// Admins can delete editor and viewer memberships
// Users can delete their own membership
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

    const isOwner = await isKitchenOwner(requesterId, kitchenId);

    if (isOwner) {
      return next();
    }

    if (targetUserId === requesterId.toString()) {
      return next();
    }

    const requesterRole = await getUserKitchenRole(requesterId, kitchenId);

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
