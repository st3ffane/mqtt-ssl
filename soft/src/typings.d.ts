/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

/* test pour l'import d'un fichier csr et key */
declare module "*.crt"
{ const value: string;
  export default value;
}
declare module "*.key"
{ const value: string;
  export default value;
}
