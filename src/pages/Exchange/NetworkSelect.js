import React from 'react';
import PropTypes from 'prop-types';
import ChevronIcon from '../../assets/svg/chevron.svg';
import NetworkOrTokenIcon from '../../components/NetworkOrTokenIcon';

const NetworkSelect = ({
  networks = [{}],
  setChainId = () => {},
  selectedChainId = 0,
}) => {
  // this sort is setting selected network first in the list,
  // so it can be visible
  const sortedNetworks = networks.sort((a) =>
    a.chainId === selectedChainId ? -1 : 1,
  );

  return (
    <div
      className={`network-select ${
        networks.length === 1 ? 'network-select_disabled' : ''
      }`}
    >
      <div
        className="network-select__absolute-wrapper"
        style={{ '--items-amount': networks.length }}
      >
        {sortedNetworks.map(({ name = '', chainId, code }) => (
          <button
            type="button"
            className="network-select__option"
            key={`select-option-${chainId}`}
            onClick={() => setChainId(chainId)}
          >
            <NetworkOrTokenIcon
              symbol={code}
              className="network-select__currency-icon"
            />
            {window.innerWidth < 1279 ? name.split(' ')[0] : name}
          </button>
        ))}
      </div>
      <img
        src={ChevronIcon}
        alt="chevron icon"
        className="network-select__chevron"
      />
    </div>
  );
};

NetworkSelect.propTypes = {
  networks: PropTypes.arrayOf(PropTypes.object),
  setChainId: PropTypes.func,
  selectedChainId: PropTypes.number,
};

export default NetworkSelect;
