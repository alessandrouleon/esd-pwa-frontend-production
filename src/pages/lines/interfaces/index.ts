export interface LineProps {
    id: string;
    code: string;
    description: string;
    createdAt: string;
    actions: string;
  }
  
  interface ILineData {
    lines: LineProps[];
    total: number;
    currentPage: number;
    nextPage: number | null;
    prevPage: number | null;
    lastPage: number;
  }
  
  export const initialLineData: ILineData = {
    lines: [],
    total: 0,
    currentPage: 1,
    nextPage: null,
    prevPage: null,
    lastPage: 0,
  };
  
  
  export interface IFormCreateLine {
    code: string;
    description: string;
  }
  
  export interface IFormLine {
    id: string;
    code: string;
    description: string;
  }
  
  export const initialLine: IFormLine = {
    id: '',
    code: '',
    description: ''
  };
  
  export interface IEditModalProps {
    line: IFormLine;
    open: boolean;
    setOpen: (open: boolean) => void;
    setAlert: (data: { open: boolean; message: string; type: 'error' | 'success' }) => void;
    setDataRefresh: (refresh: boolean) => void;
    dataRefresh: boolean;
  }
  
  
  
  export interface IDeleteModalProps {
    line: IFormLine;
    open: boolean;
    setOpen: (open: boolean) => void;
    setAlert: (data: { open: boolean; message: string; type: 'error' | 'success' }) => void;
    setDataRefresh: (refresh: boolean) => void;
    dataRefresh: boolean;
  }
  
  export interface LineExport {
    code: string;
    description: string;
    createdAt: string;
  }
  