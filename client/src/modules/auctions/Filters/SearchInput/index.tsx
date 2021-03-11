import { FC } from 'react';

import { Form, InputGroup, Button } from 'react-bootstrap';

import './styles.scss';

interface Props {
  query: string;
  changeFilters: (key: string, value: any) => void;
}

const SearchInput: FC<Props> = ({ query, changeFilters }) => {
  return (
    <InputGroup>
      <Form.Control
        className="search-input"
        placeholder="Search"
        value={query}
        onChange={(e) => changeFilters('query', e.target.value)}
      />
      {query && (
        <InputGroup.Append>
          <Button
            className="btn-with-input text-all-cups text-label search-cancel-btn"
            variant="link"
            onClick={() => changeFilters('query', '')}
          >
            Cancel
          </Button>
        </InputGroup.Append>
      )}
    </InputGroup>
  );
};

export default SearchInput;
