import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

// idioma por defecto
dayjs.locale("es");
dayjs.extend(utc);

dayjs.extend(relativeTime);
export const setDayjsLocale = (lng) => {
  dayjs.locale(lng);
};

export default dayjs;