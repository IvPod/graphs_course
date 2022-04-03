const alert = (message, type) => {
  var alertPlaceholder = document.getElementById(
    'alertPlaceholder'
  )
  alertPlaceholder.innerHTML =
    '<div class="alert alert-' +
    type +
    ' alert-dismissible" role="alert">' +
    message +
    '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
}

export default alert
