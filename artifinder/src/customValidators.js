export default function addRules(veeValidate) {
  const tournamentLink = {
    getMessage: field => `The ${field} field is not an Artifact tournament link.`,
    validate(value) {
      let url;
      try {
        url = new URL(value);
      } catch (err) {
        return false;
      }
      if (url.hostname !== 'www.playartifact.com') return false;
      if (!url.searchParams.get('invitekey')) return false;
      return true;
    },
  };

  veeValidate.Validator.extend('tourament_link', tournamentLink);
}
