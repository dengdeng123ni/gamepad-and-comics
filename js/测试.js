await(async function () {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.webkitdirectory = true;  // 允许选择目录
  fileInput.multiple = true;  // 允许选择多个文件

  // 触发文件选择框
  fileInput.click();

  // 处理文件选择
  fileInput.addEventListener('change', function (event) {
    console.log(event.target.files);

  });
})()
