export function generateSlug(text: string, unique: boolean = false) {
  let slug = text.toLowerCase().replace(/ /g, "-");

  if (unique) {
    let uniqueNumber = Math.floor(Math.random() * 1000);
    slug += "-" + uniqueNumber;
  }

  return slug;
}
