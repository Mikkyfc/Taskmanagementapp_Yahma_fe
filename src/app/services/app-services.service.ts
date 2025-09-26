import { inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { INewResponse, IResponse, Task, TaskStatus } from '../interfaces/iresponses';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { config, formatResponse, formatTaskApiResponse } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class AppServicesService {
  private renderer: Renderer2;
  private buttonOriginalText: { [key: string]: string } = {}; // Stores original button text
  private baseUrl = `${config.base}api/tasks`;
  private _http = inject(HttpClient);

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }
  

private handleError(error: any): Observable<IResponse<any>> {
    let response: IResponse<any> = {
      statusCode: error.status || 500,
      isError: true,
      msg: 'An unexpected error occurred',
      data: null
    };
    if (error.error instanceof ErrorEvent) {
      response.msg = `Client-side error: ${error.error.message}`;
    } else if (error.status === 0) {
      response.msg = 'Network error: Please check your internet connection';
    } else if (error.error && error.error.Status) {
      response = formatTaskApiResponse(error.error);
    } else {
      if (error.status === 400 && error.error?.errors) {
        const validationErrors = error.error.errors;
        const firstErrorKey = Object.keys(validationErrors)[0];
        if (firstErrorKey && validationErrors[firstErrorKey]?.length > 0) {
          response.msg = validationErrors[firstErrorKey][0];
        } else {
          response.msg = 'Bad Request: The request was invalid or cannot be served.';
        }
      } else {
        switch (error.status) {
          case 401:
            response.msg = 'Unauthorized: Authentication is required or has failed.';
            break;
          case 403:
            response.msg = 'Forbidden: You do not have permission to access this resource.';
            break;
          case 404:
            response.msg = 'Not Found: The requested resource could not be found.';
            break;
          case 405:
            response.msg = 'Method Not Allowed: The request method is not supported.';
            break;
          case 408:
            response.msg = 'Request Timeout: The server timed out waiting for the request.';
            break;
          case 409:
            response.msg = 'Conflict: The request conflicts with the current state of the resource.';
            break;
          case 415:
            response.msg = 'Unsupported Media Type: The media type is not supported.';
            break;
          case 500:
            response.msg = 'Internal Server Error: Something went wrong on the server.';
            break;
          case 502:
            response.msg = 'Bad Gateway: The server received an invalid response from the upstream.';
            break;
          case 503:
            response.msg = 'Service Unavailable: The server is not ready to handle the request.';
            break;
          case 504:
            response.msg = 'Gateway Timeout: The server did not receive a timely response.';
            break;
          default:
            response.msg = `Server error (${error.status}): ${error.message}`;
            break;
        }
      }
    }
    return of(response);
  }

  public GetItemById<T extends { id: any }>(data: Array<T>, id: any): IResponse<T> {
    if (!Array.isArray(data) || data.length === 0) {
      return { isError: true, msg: 'Invalid or empty array provided.', statusCode: 400, data: null } as unknown as IResponse<T>;
    }
    if (id === null || id === undefined) {
      return { isError: true, msg: 'ID cannot be null or undefined.', statusCode: 400, data: null } as unknown as IResponse<T>;
    }
    const item = data.find((obj) => obj.id == id);
    if (!item) {
      return { isError: true, msg: `No item found with ID: ${id}`, statusCode: 404, data: null } as unknown as IResponse<T>;
    }
    return { isError: false, statusCode: 200, data: item, msg: 'Success' } as IResponse<T>;
  }

  DisableButtonWithLoading(buttonId: string) {
    if (typeof document === 'undefined') return;
    const button = document.getElementById(buttonId);
    if (button) {
      this.buttonOriginalText[buttonId] = button.innerHTML;
      this.renderer.setProperty(
        button,
        'innerHTML',
        `<span class="animate-spin inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full mr-2"></span> Loading...`
      );
      this.renderer.setAttribute(button, 'disabled', 'true');
    }
  }

  EnableButtonWithOriginalText(buttonId: string) {
    if (typeof document === 'undefined') return;
    const button = document.getElementById(buttonId);
    if (button) {
      this.renderer.setProperty(
        button,
        'innerHTML',
        this.buttonOriginalText[buttonId] || 'Submit'
      );
      this.renderer.removeAttribute(button, 'disabled');
    }
  }

  getTasks(status?: TaskStatus, search?: string): Observable<IResponse<Task[]>> {
    let params = new HttpParams();
    if (status) {
      // Map TaskStatus to numeric values for backend
      const statusMap: { [key in TaskStatus]: number } = {
        [TaskStatus.Pending]: 0,
        [TaskStatus.InProgress]: 1,
        [TaskStatus.Completed]: 2
      };
      params = params.set('status', statusMap[status].toString());
    }
    if (search) {
      params = params.set('search', search);
    }

    const url = `${this.baseUrl}/get-all-task`;
    return this._http.get<any>(url, { params }).pipe(
      map((response: any) => {
        console.log('Raw API response:', response); // Debug
        return formatTaskApiResponse<Task[]>(response);
      }),
      catchError(this.handleError)
    );
  }

  getTask(id: number): Observable<IResponse<Task>> {
    const url = `${this.baseUrl}/get-task/${id}`;
    return this._http.get<any>(url).pipe(
      map((response: any) => formatTaskApiResponse<Task>(response)),
      catchError(this.handleError)
    );
  }

  createTask(task: Task): Observable<IResponse<Task>> {
    const url = `${this.baseUrl}/create-task`;
    return this._http.post<any>(url, task).pipe(
      map((response: any) => formatTaskApiResponse<Task>(response)),
      catchError(this.handleError)
    );
  }

  updateTask(id: number, task: Task): Observable<IResponse<void>> {
    const url = `${this.baseUrl}/update/${id}`;
    return this._http.put<any>(url, task).pipe(
      map((response: any) => formatTaskApiResponse<void>(response)),
      catchError(this.handleError)
    );
  }

  deleteTask(id: number): Observable<IResponse<void>> {
    const url = `${this.baseUrl}/delete/${id}`;
    return this._http.delete<any>(url).pipe(
      map((response: any) => formatTaskApiResponse<void>(response)),
      catchError(this.handleError)
    );
  }


}
