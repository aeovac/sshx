```typescript
import { client } from './lib.mts';

const _ = client({ ... });

await _.connect();
const o = await _.run('echo "Test"');
console.log(o) // Test
```
