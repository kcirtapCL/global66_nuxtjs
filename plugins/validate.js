import { extend, configure } from "vee-validate";
import { alpha, alpha_spaces as alphaSpaces, email, max, min, numeric, required } from "vee-validate/dist/rules";
extend("alpha", alpha);
extend("alpha_spaces", alphaSpaces);
extend("email", email);
extend("max", max);
extend("min", min);
extend("numeric", numeric);
extend("required", required);

export default function ({ app }) {
  configure({
    defaultMessage: (field, values) => {
      values._field_ = app.i18n.t(field);
      return app.i18n.t(`validations.${values._rule_}`, values);
    }
  });
}
