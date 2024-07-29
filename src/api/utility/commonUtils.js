function formatDateTime(dateTimeString) {
  const dateTime = new Date(dateTimeString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = dateTime.getDate().toString().padStart(2, "0");
  const month = months[dateTime.getMonth()];
  const year = dateTime.getFullYear();

  return `${day} ${month} ${year}`;
}

export { formatDateTime };
