import { useLocation } from 'react-router-dom';

export default function QueryParam(name: string) {
  return new URLSearchParams(useLocation().search).get(name);
}
