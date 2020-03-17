import * as Yup from "yup";

const MIN_CREDITS_NUMBER = 1;
const MAX_CREDITS_NUMBER = 999;

export const validationSchema = Yup.object().shape({
  creditsNumber: Yup.number()
    .min(MIN_CREDITS_NUMBER, "Credits must be higher than 0")
    .max(MAX_CREDITS_NUMBER, "Credits muts be less than 999")
});
