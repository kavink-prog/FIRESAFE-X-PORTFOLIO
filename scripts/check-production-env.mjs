const issues = [];
if (Number(process.versions.node.split('.')[0]) < 22) issues.push('Use Node.js 22 or newer in the build image.');
try {
  const url = new URL(process.env.NEXT_PUBLIC_CONVEX_URL);
  if (url.protocol !== 'https:' || !url.hostname.endsWith('.convex.cloud')) throw new Error();
} catch { issues.push('Set NEXT_PUBLIC_CONVEX_URL to the production Convex HTTPS deployment URL.'); }
if (!process.env.CONVEX_DEPLOYMENT?.startsWith('prod:')) {
  issues.push('Set CONVEX_DEPLOYMENT=prod:<deployment-name> and confirm it matches NEXT_PUBLIC_CONVEX_URL.');
}
if (issues.length) {
  for (const issue of issues) console.error(issue);
  process.exit(1);
}
const deployment = process.env.CONVEX_DEPLOYMENT.slice('prod:'.length);
if (new URL(process.env.NEXT_PUBLIC_CONVEX_URL).hostname !== `${deployment}.convex.cloud`) {
  console.error('Production deployment name and URL do not match.');
  process.exit(1);
}
console.log('Production environment configuration checks passed. Verify booking delivery after deployment.');
