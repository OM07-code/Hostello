async function test() {
  const req = await fetch('http://localhost:5000/api/allocation/gemini-run', { method: 'POST' });
  const data = await req.json();
  const fs = require('fs');
  fs.writeFileSync('error_trace.json', JSON.stringify(data, null, 2));
}
test();
