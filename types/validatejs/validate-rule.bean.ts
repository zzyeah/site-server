// 基础约束接口，包含通用的消息属性
export interface BaseConstraint {
  message?: string;
}

// 具体的约束类型
export type PresenceConstraint = BaseConstraint & {
  presence: boolean | { allowEmptyString?: boolean; message?: string };
};
export type LengthConstraint = BaseConstraint & {
  length?: {
    is?: number;
    minimum?: number;
    maximum?: number;
    message?: string;
  };
};
export type FormatConstraint = BaseConstraint & {
  format?: { pattern: RegExp; flags?: string; message?: string };
};
export type InclusionConstraint = BaseConstraint & {
  inclusion?: { within: any[]; message?: string };
};
export type ExclusionConstraint = BaseConstraint & {
  exclusion?: { within: any[]; message?: string };
};
export type NumericalityConstraint = BaseConstraint & {
  numericality?: {
    onlyInteger?: boolean;
    greaterThan?: number;
    greaterThanOrEqualTo?: number;
    equalTo?: number;
    lessThan?: number;
    lessThanOrEqualTo?: number;
    odd?: boolean;
    even?: boolean;
    message?: string;
  };
};
export type EmailConstraint = BaseConstraint & {
  email: boolean | { message?: string };
};
export type URLConstraint = BaseConstraint & {
  url:
    | boolean
    | { message?: string; protocols?: string[]; require_tld?: boolean };
};
export type DateConstraint = BaseConstraint & {
  date: boolean | { format?: string; message?: string };
};
export type CreditCardConstraint = BaseConstraint & {
  creditCard: boolean | { message?: string };
};
export type IPAddressConstraint = BaseConstraint & {
  ipAddress: boolean | { version?: "ipv4" | "ipv6"; message?: string };
};
export type AlphaConstraint = BaseConstraint & {
  alpha: boolean | { message?: string };
};
export type AlphanumericConstraint = BaseConstraint & {
  alphanumeric: boolean | { message?: string };
};
export type NumericConstraint = BaseConstraint & {
  numeric: boolean | { message?: string };
};
export type EqualityConstraint = BaseConstraint & {
  equality?: string | number | CustomValidationFunction;
  message?: string;
};
export type AllowBlankConstraint = BaseConstraint & {
  allowBlank?: boolean;
  message?: string;
};
export type AllowEmptyConstraint = BaseConstraint & {
  allowEmpty?: boolean;
  message?: string;
};
export type ConfirmationConstraint = BaseConstraint & {
  confirmation: boolean;
  message?: string;
};

// 合并所有约束为联合类型
export type SingleFieldConstraint =
  | PresenceConstraint
  | LengthConstraint
  | FormatConstraint
  | InclusionConstraint
  | ExclusionConstraint
  | NumericalityConstraint
  | EmailConstraint
  | URLConstraint
  | DateConstraint
  | CreditCardConstraint
  | IPAddressConstraint
  | AlphaConstraint
  | AlphanumericConstraint
  | NumericConstraint
  | EqualityConstraint
  | AllowBlankConstraint
  | AllowEmptyConstraint
  | ConfirmationConstraint;

// 自定义验证函数接口
export type CustomValidationFunction = (
  value: any,
  attributes: any
) => boolean | string | Promise<boolean | string>;

// 将额外约束合并到SingleFieldConstraint
export type CompleteFieldConstraint = SingleFieldConstraint;

// 继续使用ConstraintsObject定义整个表单字段约束的对象类型
export interface Constraints {
  [fieldName: string]:
    | CompleteFieldConstraint
    | Record<string, CompleteFieldConstraint>; // 单个字段约束或嵌套约束对象
}
