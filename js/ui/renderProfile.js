export function renderProfile(profile) {
  const avatarUrl = profile.avatar?.url || "https://placehold.co/160x160?text=Avatar";
  const avatarAlt = profile.avatar?.alt || `${profile.name} avatar`;
  const bannerUrl = profile.banner?.url || "https://placehold.co/1200x300?text=Banner";
  const bannerAlt = profile.banner?.alt || `${profile.name} banner`;

  return `
    <article class="section-card overflow-hidden p-0">
      <img class="profile-banner" src="${bannerUrl}" alt="${bannerAlt}" />
      <div class="p-5">
        <div class="flex items-start gap-4">
          <img class="profile-avatar" src="${avatarUrl}" alt="${avatarAlt}" />
          <div>
            <h1 class="font-serif text-4xl leading-none">${profile.name}</h1>
            <p class="text-sm muted-copy">${profile.email || "No email"}</p>
            <p class="mt-2 text-sm">${profile.bio || "No bio yet."}</p>
            <p class="mt-2 badge">Credits: ${profile.credits ?? 0}</p>
          </div>
        </div>
      </div>
    </article>
  `;
}
