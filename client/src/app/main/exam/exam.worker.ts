/// <reference lib="webworker" />

addEventListener('message', ({data}) => {
  const r = data.oriRowData.map((v, i) => {
    return data.jsonRowData[i] ? data.jsonRowData[i].rowData : '';
  });
  postMessage({rowData: r, consume: data.consume});
});
