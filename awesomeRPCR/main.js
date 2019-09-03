
document.getElementById('input-file').addEventListener('change', getFile)


function getFile(event) {
    const input = event.target
    if ('files' in input && input.files.length > 0) {
        placeFileContent(
        document.getElementById('content-target'),
        input.files[0])
    }
}


function placeFileContent(target, file) {
  readFileContent(file).then(content => {
    var encodedData = window.atob(content);
    target.value = JSON.stringify(JSON.parse(encodedData), null, "\t");
    }).catch(error => console.log(error))
}


function readFileContent(file) {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
            reader.onload = event => resolve(event.target.result)
            reader.onerror = error => reject(error)
            reader.readAsText(file)
        })
}


function download() {
    let fileName = document.getElementById('input-file').value;
    let  fileContent = document.getElementById('content-target').value;

    var element = document.createElement('a');
    var encodedData = window.btoa(fileContent);
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(encodedData));
    element.setAttribute('download', fileName);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }

