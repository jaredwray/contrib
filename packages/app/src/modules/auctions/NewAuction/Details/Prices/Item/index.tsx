import { FC } from 'react';

import clsx from 'clsx';
import { Image, OverlayTrigger, Tooltip } from 'react-bootstrap';

import InfoWithErrorIcon from 'src/assets/images/info-circle-with-error.svg';
import InfoIcon from 'src/assets/images/info-circle.svg';
import MoneyField from 'src/components/forms/inputs/MoneyField';

import styles from './styles.module.scss';

interface Props {
  label: string;
  name: string;
  tooltip: string;
  placeholder: string | number;
  disabled?: boolean;
  error?: string;
  minValue?: number;
  required?: boolean;
  checkMissed?: (name: string, value: string | Dinero.DineroObject) => void;
}

const Item: FC<Props> = ({
  label,
  name,
  tooltip,
  placeholder,
  disabled,
  minValue,
  required,
  checkMissed,
  error,
}: Props) => {
  const moneyPlaceholder = Number.isInteger(placeholder) ? `${placeholder}` : placeholder;
  return (
    <tr>
      <td className={clsx(styles.label, required && styles.labelRequired)}>{label}</td>
      <td>
        <MoneyField
          className={clsx(
            styles.input,
            required && styles.inputRequired,
            error && styles.inputWithError,
            'text-center p-0 m-auto',
          )}
          disabled={disabled}
          minValue={minValue}
          name={name}
          placeholder={moneyPlaceholder as string}
          required={required}
          setValueToState={checkMissed}
          withErrorMessage={false}
        />
      </td>
      <td>
        <OverlayTrigger overlay={<Tooltip>{error || tooltip}</Tooltip>} placement="top">
          <div className={clsx(styles.tooltip, error && styles.tooltipError)}>
            <Image src={error ? InfoWithErrorIcon : InfoIcon} />
          </div>
        </OverlayTrigger>
      </td>
    </tr>
  );
};

export default Item;
