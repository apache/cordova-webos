function WindowProperties() {
	blockScreenTimeout = false;
	setSubtleLightbar = false;
	fastAccelerometer = false;
};

if (typeof navigator.windowProperties == 'undefined') navigator.windowProperties = new WindowProperties();