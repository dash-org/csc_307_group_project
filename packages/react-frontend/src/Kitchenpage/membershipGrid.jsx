// kitchenGrid.jsx
import './kitchenGrid.css';
import { Button } from '../Components/Button/button';

export const MembershipGrid = (props) => {
  const { memberships, removeMembership } = props;

  return (
    <section className="hb-kitchen-grid">
      {memberships && memberships.length > 0 ? (
        memberships.map((membership) => {
          // user label: if userId is populated, prefer name/username; otherwise show raw id
          const user = membership.userId
            ? membership.userId.name || membership.userId
            : 'NO USER FOUND';

          const addedAtText = membership.addedAt
            ? new Date(membership.addedAt).toLocaleDateString()
            : 'Unknown';

          const OGuser = membership.createdBy
            ? membership.createdBy.name || membership.createdBy
            : 'NO USER FOUND';

          return (
            <div key={membership._id} className="hb-kitchen-card">
              {/* Main label: member user */}
              <h3 className="hb-kitchen-name">
                Member: {user || 'Unknown user'}
              </h3>

              {/* Role */}
              <p className="hb-kitchen-created">
                Role: {membership.role || 'Unknown'}
              </p>

              {/* Added date */}
              <p className="hb-kitchen-created">Added: {addedAtText}</p>

              <p className="hb-kitchen-created">Added By User: {OGuser}</p>

              <div className="hb-kitchen-actions">
                <Button
                  className="hb-delete-btn"
                  hierarchy="tertiary"
                  buttonText="Remove"
                  onClick={() => removeMembership(membership._id)}
                />
              </div>
            </div>
          );
        })
      ) : (
        <p className="hb-card-text">
          This kitchen doesn&apos;t have any members yet. Invite someone to get
          started.
        </p>
      )}
    </section>
  );
};
