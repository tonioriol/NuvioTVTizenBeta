(function defineNuvioEnv() {
  var root = typeof globalThis !== "undefined" ? globalThis : window;
  var env = root.__NUVIO_ENV__ || {};
  var values = {
  "NUVIO_SUPABASE_URL": "https://api.nuvio.tv",
  "NUVIO_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzgxNTIxMzQ2LCJleHAiOjE5MzkyMDEzNDZ9.tmQaj682pwzehpqlgCDMnySOqiUvpgRbrE43T4VJpDI",
  "TV_LOGIN_WEB_BASE_URL": "https://nuvio.tv/tv-login",
  "YOUTUBE_PROXY_URL": "https://nuviomedia.github.io/NuvioWeb/youtube-proxy.html",
  "PARENTAL_GUIDE_API_URL": "https://api.tiffara.com/",
  "INTRODB_API_URL": "https://api.introdb.app/",
  "IMDB_RATINGS_API_BASE_URL": "https://seriesgraph.com/",
  "IMDB_TAPFRAME_API_BASE_URL": "",
  "AVATAR_PUBLIC_BASE_URL": "https://api.nuvio.tv/storage/v1/object/public/avatars",
  "UNIQUE_CONTRIBUTIONS_BASE_URL": "https://gitserver.tapframe.space/",
  "DONATIONS_BASE_URL": "https://tapframe.space/contribute/",
  "DONATIONS_DONATE_URL": "https://tapframe.space/contribute",
  "SPONSOR_NAMES": "ragmehos.",
  "TMDB_API_KEY": "439c478a771f35c05022f9feabcca01c",
  "TRAKT_CLIENT_ID": "e04d98107c4066fb86e123e320306dd4fa0309c4ea2f63235f008a48e115944b",
  "TRAKT_CLIENT_SECRET": "a86c4bbe18c5f72ed708b0d616925694f9fb87e5e61af50f7a041b2871a459d6",
  "TRAKT_API_URL": "https://api.trakt.tv",
  "TRAKT_REDIRECT_URI": "urn:ietf:wg:oauth:2.0:oob",
  "SIMKL_CLIENT_ID": "",
  "SIMKL_API_URL": "https://api.simkl.com",
  "SIMKL_APP_NAME": "nuvio"
};
  for (var key in values) {
    if (Object.prototype.hasOwnProperty.call(values, key)) {
      env[key] = values[key];
    }
  }
  root.__NUVIO_ENV__ = env;
}());
