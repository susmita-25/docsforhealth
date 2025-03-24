import { http, delay, HttpResponse } from "msw";

import { API_RESOURCE } from "../../app/shared/constant";
import { PEOPLE } from "../fixtures";
// import { delayedResponse } from "../utils";

const BASE_URL = `/mock-api/${API_RESOURCE.PEOPLE}*`;

export const getPeople = http.get(BASE_URL, () => {
  delay(500);
  return HttpResponse.json(PEOPLE);
});

export const handlers = [getPeople];
