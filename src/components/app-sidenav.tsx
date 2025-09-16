"use client";
import Sidenav, { SidenavItem, SidenavSeparator } from "./sidenav";
import {
  AlignStartVerticalIcon,
  CloudIcon,
  CogIcon,
  DollarSignIcon,
  GroupIcon,
  ReceiptIcon,
  UserIcon,
  LayoutDashboardIcon,
  PercentCircleIcon,
  AreaChartIcon,
  BanIcon,
  Building2,
} from "lucide-react";
import { About } from "./about-dialog";
// import { usePerms } from "./perms-provider";
// import SelectEntidad from "./selector-entidad";

export default function AppSidenav() {
  // const { isAdmin, hasPerm } = usePerms();

  return (
    <div className="text-xs">
      <Sidenav>
        {/* <SelectEntidad /> */}
        <h1>HOLAA</h1>
        {/* <div>
          <aside className="main-sidebar">
            <section className="sidebar">
              <ul className="sidebar-menu tree" data-widget="tree">
                <li className="active">
                  <a href="index.html">
                    <i
                      className="fas fa-tachometer-alt fa-fw"
                      aria-hidden="true"
                    ></i>
                    <span>Panel de control</span>
                  </a>
                </li>

                <li className="treeview">
                  <a>
                    <i className="fas fa-barcode fa-fw" aria-hidden="true"></i>{" "}
                    <span>Activos</span>
                    <i
                      className="fas fa-angle-left pull-right fa-fw"
                      aria-hidden="true"
                    ></i>{" "}
                  </a>
                  <ul className="treeview-menu">
                    <li>
                      <a href="activos.html">
                        <i
                          className="fa-regular fa-circle text-grey fa-fw"
                          aria-hidden="true"
                        ></i>{" "}
                        Todos los activos
                        <span className="badge">2547</span>
                      </a>
                    </li>

                    <li id="deployed-sidenav-option">
                      <a href="activos.html">
                        <i
                          className="fa-regular fa-circle text-blue fa-fw"
                          aria-hidden="true"
                        ></i>{" "}
                        Asignados
                        <span className="badge">401</span>
                      </a>
                    </li>
                    <li id="byod-sidenav-option">
                      <a href="activos.html">
                        <i
                          className="fas fa-times text-red fa-fw"
                          aria-hidden="true"
                        ></i>
                        Pendientes de retiro
                        <span className="badge">0</span>
                      </a>
                    </li>
                    <li id="archived-sidenav-option">
                      <a href="activos.html">
                        <i
                          className="fas fa-times text-red fa-fw"
                          aria-hidden="true"
                        ></i>
                        Pendientes de devolución
                        <span className="badge">50</span>
                      </a>
                    </li>

                    <li id="pending-sidenav-option">
                      <a href="activos.html">
                        <i
                          className="fa-regular fa-circle text-orange fa-fw"
                          aria-hidden="true"
                        ></i>{" "}
                        En reparación
                        <span className="badge">50</span>
                      </a>
                    </li>
                    <li id="undeployable-sidenav-option">
                      <a href="activos.html">
                        <i
                          className="fas fa-times text-red fa-fw"
                          aria-hidden="true"
                        ></i>
                        Inactivos
                        <span className="badge">0</span>
                      </a>
                    </li>
                  </ul>
                </li>

                <li className="treeview" id="Usuarios">
                  <a>
                    <i className="fas fa-users fa-fw" aria-hidden="true"></i>{" "}
                    <span>Usuarios</span>
                    <i
                      className="fas fa-angle-left pull-right fa-fw"
                      aria-hidden="true"
                    ></i>{" "}
                  </a>

                  <ul className="treeview-menu">
                    <li id="Todos los usuarios">
                      <a href="usuarios.html">
                        <i
                          className="fa-regular fa-circle text-grey fa-fw fa-fw"
                          aria-hidden="true"
                        ></i>{" "}
                        Todos los usuarios
                        <span className="badge">50</span>
                      </a>
                    </li>
                    <li className="" id="Super Administradores">
                      <a href="usuarios.html">
                        <i
                          className="fas fa-crown text-danger fa-fw"
                          aria-hidden="true"
                        ></i>{" "}
                        Super Administradores
                        <span className="badge">5</span>
                      </a>
                    </li>
                    <li className="" id="Administradores">
                      <a href="usuarios.html">
                        <i
                          className="fas fa-crown text-warning fa-fw"
                          aria-hidden="true"
                        ></i>{" "}
                        Administradores
                        <span className="badge">10</span>
                      </a>
                    </li>
                    <li className="" id="Usuarios">
                      <a href="usuarios.html">
                        <i
                          className="fas fa-times text-danger fa-fw"
                          aria-hidden="true"
                        ></i>{" "}
                        Usuarios
                        <span className="badge">40</span>
                      </a>
                    </li>
                    <li className="" id="Habilitados">
                      <a href="usuarios.html">
                        <i className="fa-solid fa-person-circle-check text-success fa-fw"></i>
                        Habilitados
                        <span className="badge">30</span>
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </section>
          </aside>
        </div> */}
      </Sidenav>
    </div>
  );
}
