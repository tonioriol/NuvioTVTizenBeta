# Nuvio TV Beta for TizenBrew

Self-contained TizenBrew module for the latest Nuvio beta.

Add this repository in TizenBrew:

```text
tonioriol/NuvioTVTizenBeta
```

The GitHub Actions workflow checks for new Nuvio prereleases, builds the matching NuvioWeb tag, syncs the compiled app into this TizenBrew module, copies the official `nuvio.env.js` from the release `.wgt`, and commits the result.

## Notes

- The module is named `Nuvio TV Beta` so it can be distinguished from stable Nuvio builds.
- The updater preserves the TizenBrew module shape: `packageType: "app"` and `appPath: "app/index.html"`.
- This bundles the web app for TizenBrew. Features that depend on a native Tizen service may still require the official `.wgt` installer.
