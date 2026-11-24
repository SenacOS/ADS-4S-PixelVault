export async function deliverJson(artifact) {
  const blob = new Blob([artifact.content], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  try {
    anchor.href = url;
    anchor.download = artifact.name;
    document.body.appendChild(anchor);
    anchor.click();
    return 'Download do arquivo JSON solicitado.';
  } finally {
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
