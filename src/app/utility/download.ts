export const downloadFile = (path: string, name: string): void => {
    const link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = path;
    link.download = name;
    link.click();
    link.remove();
};
