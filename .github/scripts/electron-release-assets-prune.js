const packageData = require('../../release/app/package.json');

/**
 * Workaround for this issue:
 * https://github.com/electron-userland/electron-builder/issues/4940
 */
module.exports = async (github, context) => {
  console.log('packageData.version', packageData.version);
  const releasesRes = await github.request(
    `GET /repos/{owner}/{repo}/releases`,
    {
      tag: packageData.version,
      ...context.repo,
    }
  );
  const draftRelease = releasesRes.data.find((release) => release.draft);
  if (draftRelease) {
    const releaseId = draftRelease.id;
    console.log(`Deleting release: ${releaseId} assets`);

    const assetsRes = await github.request(
      'GET /repos/{owner}/{repo}/releases/{releaseId}/assets',
      {
        releaseId,
        ...context.repo,
      }
    );
    const assets = assetsRes.data;

    for (const asset of assets) {
      await github.request(
        'DELETE /repos/{owner}/{repo}/releases/assets/{assetId}',
        {
          assetId: asset.id,
          ...context.repo,
        }
      );
    }
  }
};
