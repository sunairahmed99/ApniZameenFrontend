export const formatPrice = (price) => {
  if (!price) return "0";
  const num = Number(price);
  if (isNaN(num)) return price;

  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(2)} Crore`;
  } else if (num >= 100000) {
    return `${(num / 100000).toFixed(2)} Lakh`;
  } else {
    return num.toLocaleString();
  }
};

export const formatTimeAgo = (date) => {
  if (!date) return "";
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};
