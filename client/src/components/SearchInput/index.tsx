import { FC, BaseSyntheticEvent, useCallback, useState } from 'react';

import clsx from 'clsx';
import { Form, InputGroup, Button } from 'react-bootstrap';

import styles from './styles.module.scss';

interface Props {
  placeholder?: string;

  onChange(value: string): void;

  onCancel?(): void;

  onClick?(event: BaseSyntheticEvent): void;

  className?: string;
  disabled?: boolean;
}

const SearchInput: FC<Props> = ({ disabled = false, placeholder, onChange, onCancel, onClick, className }) => {
  const [query, setQuery] = useState<string>('');

  const handleChange = useCallback(
    (event) => {
      setQuery(event.target.value);
      onChange(event.target.value);
    },
    [onChange],
  );

  const handleCancel = useCallback(() => {
    setQuery('');
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  return (
    <InputGroup className={className}>
      <Form.Control
        disabled={disabled}
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onClick={onClick}
      />
      {query && (
        <InputGroup.Append>
          <Button className={clsx(styles.cancelBtn, 'text-all-cups text-label')} variant="link" onClick={handleCancel}>
            Cancel
          </Button>
        </InputGroup.Append>
      )}
    </InputGroup>
  );
};

export default SearchInput;
