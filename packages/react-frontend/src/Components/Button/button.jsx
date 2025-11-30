import PropTypes from 'prop-types';
import React from 'react';
import { useReducer } from 'react';
import './button.css';

export const Button = ({
  buttonText = 'Button',
  hierarchy,
  stateProp,
  className,
  onClick,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    hierarchy: hierarchy || 'primary',

    state: stateProp || 'enabled',
  });

  return (
    <button
      className={`button ${state.state} ${state.hierarchy} ${className}`}
      onClick={onClick}
      onMouseEnter={() => {
        dispatch('mouse_enter');
      }}
      onMouseLeave={() => {
        dispatch('mouse_leave');
      }}
    >
      <div className="div">
        {((state.hierarchy === 'primary' && state.state === 'disabled') ||
          (state.hierarchy === 'primary' && state.state === 'enabled') ||
          (state.hierarchy === 'primary' && state.state === 'hover') ||
          (state.hierarchy === 'primary' && state.state === 'pressed') ||
          (state.hierarchy === 'secondary' && state.state === 'disabled') ||
          (state.hierarchy === 'secondary' && state.state === 'enabled') ||
          (state.hierarchy === 'secondary' && state.state === 'hover') ||
          (state.hierarchy === 'secondary' && state.state === 'pressed') ||
          state.hierarchy === 'tertiary') && <>{buttonText}</>}

        {state.state === 'focus' &&
          ['primary', 'secondary'].includes(state.hierarchy) && (
            <div className="text-wrapper">{buttonText}</div>
          )}
      </div>
    </button>
  );
};

function reducer(state, action) {
  switch (action) {
    case 'mouse_enter':
      return {
        ...state,
        state: 'hover',
      };

    case 'mouse_leave':
      return {
        ...state,
        state: 'enabled',
      };
  }

  return state;
}

Button.propTypes = {
  buttonText: PropTypes.string,
  hierarchy: PropTypes.oneOf(['primary', 'secondary', 'tertiary']),
  stateProp: PropTypes.oneOf([
    'enabled',
    'pressed',
    'focus',
    'hover',
    'disabled',
  ]),
  onClick: PropTypes.func,
};
