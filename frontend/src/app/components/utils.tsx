export const formatDuration = (duration: number) => {
    const durationInSeconds = duration / 1000; // Convert to seconds
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`; // Format to MM:SS
  };

export const formatDownloadFile = (param: string) => {
    const date = new Date()
      .toLocaleString("en-US", { hour12: false })
      .replace(/:/g, "-")
      .replace(/ /g, "_")
      .replace(/,/g, "");
  
    return `title_${param}_${date}.mp3`;
  };