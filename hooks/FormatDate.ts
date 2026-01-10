interface UseFormatDate {
  formatDate: (dateString: string | Date) => string;
  formatUpdatedAt: (dateString: string | Date) => string;
  formatDateArticle: (dateString?: string | Date) => string;
  formatWithCategoryId: (
    dateString: string | Date,
    categoryId: string
  ) => string;
}

export default function useFormatDate(): UseFormatDate {
  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    const day = date.getDate().toString().padStart(2, "0");
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  const formatUpdatedAt = (dateString: string | Date): string => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    const day = date.getDate().toString().padStart(2, "0");
    const monthNames = [
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
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  const formatDateArticle = (dateString?: string | Date): string => {
    if (!dateString) return "";
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "";
    }

    const monthNames = [
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
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const formatWithCategoryId = (
    dateString: string | Date,
    categoryId: string
  ): string => {
    const formattedDate = formatDate(dateString);
    return `${formattedDate} (ID: ${categoryId})`;
  };

  return {
    formatDate,
    formatUpdatedAt,
    formatDateArticle,
    formatWithCategoryId,
  };
}
