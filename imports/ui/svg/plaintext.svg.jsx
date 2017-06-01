import React from 'react';

const PlaintextSVG = ({ onClick }) => (
	<svg className="plaintextSVG" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 161.8 100" onClick={event => onClick(event)}>
	  <g>
	    <rect x="14.28" y="14.19" width="42.95" height="14.29"/>
	    <rect x="69.23" y="14.19" width="78.28" height="14.29"/>
	  </g>
	  <g>
	    <rect x="14.28" y="71.52" width="42.95" height="14.29"/>
	    <rect x="69.23" y="71.56" width="14.25" height="14.25" rx="7.12" ry="7.12"/>
	    <rect x="85.26" y="71.56" width="14.25" height="14.25" rx="7.12" ry="7.12"/>
	    <rect x="101.3" y="71.56" width="14.25" height="14.25" rx="7.12" ry="7.12"/>
	    <rect x="117.33" y="71.56" width="14.25" height="14.25" rx="7.12" ry="7.12"/>
	    <rect x="133.36" y="71.56" width="14.25" height="14.25" rx="7.12" ry="7.12"/>
	  </g>
	  <g>
	    <rect x="14.28" y="42.86" width="42.95" height="14.29"/>
	    <rect x="106.23" y="42.86" width="41.28" height="14.29"/>
	    <rect x="69.23" y="42.86" width="24.83" height="14.29"/>
	  </g>
	</svg>
);

export default PlaintextSVG;
