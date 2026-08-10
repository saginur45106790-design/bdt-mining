export const triggerAdsterraAd = (adUrl, callback) => {
  if (!adUrl) {
    if (callback) callback();
    return;
  }

  try {
    window.open(adUrl, '_blank', 'noopener,noreferrer');
  } catch (error) {
    console.error('Failed to trigger Adsterra redirect:', error);
  }

  if (callback) {
    callback();
  }
};