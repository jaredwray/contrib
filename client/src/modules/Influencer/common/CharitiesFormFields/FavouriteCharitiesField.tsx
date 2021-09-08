import { FC, useCallback } from 'react';

import CharitiesAutocomplete from 'src/components/CharitiesAutocomplete';
import useField from 'src/components/Form/hooks/useField';
import { Charity } from 'src/types/Charity';

interface Props {
  name: string;
  disabled?: boolean;
}

export const FavouriteCharitiesField: FC<Props> = ({ name, disabled }) => {
  const field = useField(name, { disabled });
  const handleFavoriteCharityChange = useCallback(
    (charity: Charity, shouldBeFavorite: boolean) => {
      const favoriteCharities = field.value as Charity[];

      const index = favoriteCharities.findIndex((c: Charity) => c.id === charity.id);
      const isFavorite = index >= 0;

      if (isFavorite && !shouldBeFavorite) {
        field.onChange([...favoriteCharities.slice(0, index), ...favoriteCharities.slice(index + 1)]);
      } else if (!isFavorite && shouldBeFavorite) {
        field.onChange([...favoriteCharities, charity]);
      }
    },
    [field],
  );

  return (
    <CharitiesAutocomplete
      charities={field.value}
      favoriteCharities={[]}
      withTitle={true}
      onChange={handleFavoriteCharityChange}
    />
  );
};
