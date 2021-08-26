import IntercomStateManager from './IntercomStateManager';
import NewRelicInitializer from './NewRelicInitializer';

export default function InternalScripts() {
  return (
    <>
      <IntercomStateManager />
      <NewRelicInitializer />
    </>
  );
}
