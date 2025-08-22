import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError } from 'rxjs/operators';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocurrió un error desconocido.';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error del cliente: ${error.error.message}`;
        messageService.add({
          severity: 'error',
          summary: 'Error de Cliente',
          detail: errorMessage
        });
      } else {
        switch (error.status) {
          case 404:
            errorMessage = `Error 404: Recurso no encontrado.`;
            break;
          case 500:
            errorMessage = `Error 500: Error interno del servidor.`;
            break;
          case 401:
            errorMessage = `Error 401: No autorizado.`;
            break;
          default:
            errorMessage = `Error HTTP: ${error.status} - ${error.statusText}`;
            break;
        }
        messageService.add({
          severity: 'error',
          summary: 'Error del Servidor',
          detail: errorMessage
        });
      }
      throw error;
    })
  );
};