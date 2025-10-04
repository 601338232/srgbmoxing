let jsonData = null;

function generate() {
  const count = parseInt(document.getElementById("ledCount").value);
  const width = parseInt(document.getElementById("width").value);
  const height = parseInt(document.getElementById("height").value);
  const radius = parseFloat(document.getElementById("radius").value);
  const startAngle = parseFloat(document.getElementById("startAngle").value) * Math.PI/180;
  const prodName = document.getElementById("prodName").value;

  const cx = width/2;
  const cy = height/2;
  let coords = [];
  let names = [];
  for (let i=0; i<count; i++) {
    let theta = startAngle + (2*Math.PI*i/count);
    let x = Math.round(cx + radius * Math.cos(theta));
    let y = Math.round(cy + radius * Math.sin(theta));
    coords.push([x,y]);
    names.push("Led"+(i+1));
  }

  jsonData = {
    ProductName: prodName,
    DisplayName: prodName,
    Brand: "Custom",
    Type: "custom",
    LedCount: count,
    Width: width,
    Height: height,
    LedMapping: [...Array(count).keys()],
    LedCoordinates: coords,
    LedNames: names
  };

  document.getElementById("output").textContent = JSON.stringify(jsonData, null, 2);
  drawPreview(coords, width, height);
}

function downloadJson() {
  if (!jsonData) return alert("请先生成模型");
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], {type: "application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = jsonData.ProductName + ".json";
  a.click();
}

// 导入 JSON
document.getElementById("fileInput").addEventListener("change", (e)=>{
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    try {
      const data = JSON.parse(ev.target.result);
      jsonData = data;
      document.getElementById("ledCount").value = data.LedCount;
      document.getElementById("width").value = data.Width;
      document.getElementById("height").value = data.Height;
      document.getElementById("prodName").value = data.ProductName;
      drawPreview(data.LedCoordinates, data.Width, data.Height);
      document.getElementById("output").textContent = JSON.stringify(data, null, 2);
    } catch(err) {
      alert("解析失败: " + err);
    }
  };
  reader.readAsText(file);
});

// 画布预览
function drawPreview(coords, w, h) {
  const canvas = document.getElementById("preview");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "blue";
  coords.forEach((pt,i)=>{
    let x = pt[0] / w * canvas.width;
    let y = pt[1] / h * canvas.height;
    ctx.beginPath();
    ctx.arc(x,y,5,0,2*Math.PI);
    ctx.fill();
    ctx.fillText(i, x+6,y);
  });
}