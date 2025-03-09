import swal from "sweetalert";

export const useSwal = () => {
  const Success = (message?: string) => swal("OK", message ?? "Success", "success");

  const Error = (message?: string) => swal("Error", message ?? "Something goes wrong", "error");

  const Warning = (callback: Function, message?: string) => {
    swal("Warning", message ?? "Are you sure?", "warning", { dangerMode: true, buttons: ['No', 'Yes'] })
      .then((resp) => resp && callback());
  }

  return {
    Success,
    Error,
    Warning
  }
}