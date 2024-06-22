import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import { columns } from "./table/columns";
import {
  EmployeeProps,
  IFormUpdateEmployee,
  // EmployeeExport,
  initialEmployeeUpdate,
  initialStateData,
} from "./interfaces";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Grid, IconButton, debounce } from "@mui/material";
import { COLORS } from "../../themes/colors";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Toolbar } from "../../components/toolbar";
import { Alert } from "../../components/alert";
import { InitialAlertProps } from "../../components/alert/interfaces";
import { findManyEmployee, searchForEmployee } from "../../services/employees";
import { CreateModal } from "./modal/createModal";
import { Loader } from "../../components/loader";
// import { UpdateModal } from "./modal/updateModal";
import { DeleteModal } from "./modal/deleteModal";
// import ExportXLSX from "../../utils/exportXLSX";
// import axios from "axios";

export function Employees() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(11);
  const [data, setData] = useState(initialStateData);
  const [open, setOpen] = useState(false);
  const [dataRefresh, setDataRefresh] = useState(false);
  const [alert, setAlert] = useState(InitialAlertProps);
  const [employee, setEmployee] = useState<IFormUpdateEmployee>(
    initialEmployeeUpdate
  );
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (value: string) => {
    debouncedSearch(value);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleOpen = () => setOpen(!open);

  const handleUpdate = (item: IFormUpdateEmployee) => {
    setEmployee(item);
    setOpenUpdate(!openUpdate);
    setSelectedRow(item.id);
  };

  const handleOpenDelete = (item: IFormUpdateEmployee) => {
    setEmployee(item);
    setOpenDelete(!openDelete);
    setSelectedRow(item.id);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(page + 1);
  };

  //Exportar todos os items da tabela de listagem.
  //   const handleExport = useCallback(async () => {
  //     try {
  //       const response = await findAllShiftNotPaginated();
  //       if (response.status === 200) {
  //         const parseData = response.data.map((item: ShiftExport) => ({
  //           Código: item.code,
  //           Descrição: item.description,
  //           "Data de criação": formatTime(item.createdAt),
  //         }));
  //         ExportXLSX(parseData, "Lista de Turnos");
  //       }
  //     } catch (error) {
  //       setAlert({
  //         open: true,
  //         message: "Erro ao emitir relatório de turnos",
  //         type: "error",
  //       });
  //     }
  //   }, []);

  //Inport file
  //   const handleUploadShift = async (
  //     event: React.ChangeEvent<HTMLInputElement>
  //   ) => {
  //     const files = event.target.files;
  //     if (!files || files.length === 0) return;
  //     const file = files[0];
  //     try {
  //       const response = await uploadShift(file);
  //       if (response && (response.status === 201 || response.status === 200)) {
  //         setAlert({
  //           open: true,
  //           message: "Upload turno realizado com sucesso.",
  //           type: "success",
  //         });
  //       }
  //     } catch (error) {
  //       if (axios.isAxiosError(error) && error.response) {
  //         const { message } = error.response.data;
  //         setAlert({
  //           open: true,
  //           message: message || "Internal server error",
  //           type: "error",
  //         });
  //       } else {
  //         setAlert({
  //           open: true,
  //           message: "Erro ao emitir relatório de turnos",
  //           type: "error",
  //         });
  //       }
  //     }
  //   };

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await findManyEmployee(page);
      const employees = response.data.employees;
      const customEmployeesList = employees.map((item: EmployeeProps) => ({
        ...item,
        departmentId: item.Department?.description,
        shiftId: item.Shift?.description,
        lineId: item.Line?.code,
      }));
      setData({
        employees: customEmployeesList,
        total: response.data.total,
        currentPage: response.data.currentPage,
        nextPage: response.data.nextPage,
        prevPage: response.data.prevPage,
        lastPage: response.data.lastPage,
      });

      setDataRefresh(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchData = useCallback(
    async (page: number) => {
      try {
        const response = await searchForEmployee(page, searchValue);
        const employees = response.data.employees;
        const customEmployeesList = employees.map((item: EmployeeProps) => ({
          ...item,
          departmentId: item.Department?.description,
          shiftId: item.Shift?.description,
          lineId: item.Line?.code,
        }));
        setData({
          employees: customEmployeesList,
          total: response.data.total,
          currentPage: response.data.currentPage,
          nextPage: response.data.nextPage,
          prevPage: response.data.prevPage,
          lastPage: response.data.lastPage,
        });
        setDataRefresh(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [searchValue]
  );

  //Função usada no seach
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchValue(value);
      }, 500),
    [setSearchValue]
  );

  useEffect(() => {
    if (searchValue === "") {
      fetchData(page + 1);
    } else {
      searchData(page + 1);
    }
    setSelectedRow(null);
  }, [page, searchValue, dataRefresh, searchData]);

  return (
    <>
      <Alert
        open={alert.open}
        onClose={() => setAlert({ ...alert, open: false })}
        message={alert.message}
        type={alert.type}
      />

      {open && (
        <CreateModal
          open={open}
          setOpen={setOpen}
          setPage={setPage}
          setDataRefresh={setDataRefresh}
          dataRefresh={dataRefresh}
          setAlert={setAlert}
        />
      )}

      {/* {openUpdate && (
        <UpdateModal
          shift={shift}
          open={openUpdate}
          setOpen={setOpenUpdate}
          setAlert={setAlert}
          setDataRefresh={setDataRefresh}
          dataRefresh={dataRefresh}
        />
      )} */}

      {openDelete && (
        <DeleteModal
          employee={employee}
          open={openDelete}
          setOpen={setOpenDelete}
          setAlert={setAlert}
          setDataRefresh={setDataRefresh}
          dataRefresh={dataRefresh}
        />
      )}


      {loading ? (
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader />
        </div>
      ) : (
        <>
          <Toolbar
            titleModule="Funcionários"
            onSearch={handleSearch}
            handleExport={() => {}}
            onUpload={() => {}}
            handleSave={handleOpen}
          />
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        minWidth: column.minWidth,
                        background: COLORS.PRIMARY_100,
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.employees.map((employee) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={employee.id}
                      sx={{
                        backgroundColor:
                          selectedRow === employee.id
                            ? COLORS.PRIMARY_50
                            : "inherit",
                        "&:hover": {
                          backgroundColor: COLORS.PRIMARY_50,
                        },
                      }}
                    >
                      {columns.map((column) => {
                        const value = employee[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            size="small"
                          >
                            {column.renderCell
                              ? column.renderCell({ row: employee })
                              : value}
                            {column.id === "actions" && (
                              <Grid
                                container
                                spacing={1}
                                justifyContent="center"
                              >
                                <Grid item>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleUpdate(employee)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Grid>
                                <Grid item>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleOpenDelete(employee)}
                                    disabled={employee.status !== "ativo"}
                                  >
                                    <DeleteOutlineIcon />
                                  </IconButton>
                                </Grid>
                              </Grid>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[0]}
            component="div"
            count={data.total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </>
  );
}
