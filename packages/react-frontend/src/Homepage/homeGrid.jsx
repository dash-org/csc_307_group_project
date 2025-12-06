import './homeGrid.css';
import { Button } from '../Components/Button/button';
export const HomeGrid = (props) => {
  return (
    <section className="hb-kitchen-grid">
      {props.kitchens && props.kitchens.length > 0 ? (
        props.kitchens.map((kitchen) => (
          <div key={kitchen._id} className="hb-kitchen-card">
            <h3 className="hb-kitchen-name">{kitchen.name}</h3>
            <p className="hb-kitchen-created">
              Created: {new Date(kitchen.createdAt).toLocaleDateString()}
            </p>
            <p className="hb-kitchen-created"> Owner: {kitchen.owner.name}</p>

            <div className="hb-kitchen-actions">
              <Button
                className="hb-view-btn"
                hierarchy="primary"
                buttonText="View"
                onClick={() => {
                  window.location.href = `/kitchens/${kitchen._id}`;
                }}
              />

              <Button
                className="hb-delete-btn"
                hierarchy="tertiary"
                buttonText="Delete"
                onClick={() => props.removeKitchen(kitchen._id)}
              />
            </div>
          </div>
        ))
      ) : (
        <p className="hb-card-text">
          You don’t have any kitchens set up. Create one to start tracking
          supplies, members, and shopping lists.
        </p>
      )}
    </section>
  );
};
