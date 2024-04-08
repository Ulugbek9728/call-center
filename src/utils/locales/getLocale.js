import {getStorage} from "../storages";

export const getLocale = () => getStorage().getItem("i18nextLng");
