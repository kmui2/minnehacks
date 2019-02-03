import Expo from "expo";

const { manifest } = Expo.Constants;
export const HOST = __DEV__ ?
	`${manifest.debuggerHost.split(`:`)[0]}:8000` :
	process.env.REACT_NATIVE_HOST;
