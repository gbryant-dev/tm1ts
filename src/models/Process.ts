const BEGIN_GENERATED_STATEMENTS = '#****Begin: Generated Statements***';
const END_GENERATED_STATEMENTS = '#****End: Generated Statements****'; 
const AUTO_GENERATED_STATEMENTS = `${BEGIN_GENERATED_STATEMENTS}\r\n${END_GENERATED_STATEMENTS}\r\n`;

class Process {
    
    public name: string;
    public hasSecurityAccess: boolean = false;
    public prologProcedure: string = '';
    public metadataProcedure: string = '';
    public dataProcedure: string = '';
    public epilogProcedure: string = '';
    public dataSource: ProcessDataSource = {
        Type: 'None',
        dataSourceNameForClient: null,
        dataSourceNameForServer: null,
        asciiDecimalSeparator: ".",
        asciiDelimiterChar: ",",
        asciiDelimiterType: "Character",
        asciiHeaderRecords: 1,
        asciiQuoteCharacter: "\"",
        asciiThousandSeparator: ",",
        subset: null,
        view: null,
        userName: null,
        password: null,
        query: null,
        usesUnicode: false
    }
    public variables: ProcessVariable[] = [];
    public parameters: ProcessParameter[] = [];
    public UIData: string = 'CubeAction=1511\fDataAction=1503\fCubeLogChanges=0\f';
    public variablesUIData: string[] = [];
    

    constructor(
        name: string,
        hasSecurityAccess?: boolean,
        prologProcedure?: string,
        metadataProcedure?: string,
        dataProcedure?: string,
        epilogProcedure?: string,
        dataSource?: ProcessDataSource,
        variables?: ProcessVariable[],
        parameters?: ProcessParameter[],
        UIData?: string,
        variablesUIData?: string[]
    ) {
        this.name = name;
        this.hasSecurityAccess = hasSecurityAccess,
        this.prologProcedure = Process.addGeneratedStatement(prologProcedure);
        this.metadataProcedure = Process.addGeneratedStatement(metadataProcedure);
        this.dataProcedure = Process.addGeneratedStatement(dataProcedure);
        this.epilogProcedure = Process.addGeneratedStatement(epilogProcedure);
        this.dataSource = {...this.dataSource, ...dataSource};
        this.variables = variables;
        this.parameters = parameters;
        this.UIData = UIData;
        this.variablesUIData = variablesUIData;
    }

    static addGeneratedStatement(code: string = ''): string {
        const pattern = /#\*\*\*\*Begin: Generated Statements[\s\S]*#\*\*\*\*End: Generated Statements\*\*\*\*/g;
        if (pattern.test(code)) {
            return code;
        } else {
            return AUTO_GENERATED_STATEMENTS + code;
        }
    }
    
    static fromJson(data: any) {
        return new Process(
            data.Name,
            data.HasSecurityAccess,
            data.PrologProcedure,
            data.MetadataProcedure,
            data.DataProcedure,
            data.EpilogProcedure,
            data.DataSource,
            data.Variables,
            data.Parameters,
            data.UIData,
            data.VariablesUIData
        );
    }

    get body() {
        return this.constructBody();
    }

    addVariable(name: string, type: "String" | "Numeric") {
        const variable: ProcessVariable = {
            Name: name,
            Type: ProcessVariableType[type],
            Position: this.variables.length + 1,
            StartByte: 0,
            EndByte: 0
        }

        this.variables.push(variable);
        const typeMap = {
            String: 32,
            Numeric: 33
        }

        const variableUIData = `VarType=${typeMap[type]}\fColType=827\f`;
        this.variablesUIData.push(variableUIData);
    }

    removeVariable(name: string) {
        const index = this.variables.findIndex(v => v.Name === name);
        this.variables.splice(index, 1);
        this.variablesUIData.splice(index, 1);
    }

    addParameter(name: string, prompt: string, value: string | number, type?: "String" | "Numeric") {
        // Infer type if not provided
        
        const paramType = type ? type : typeof value == 'string' ? 'String' : 'Numeric';
        const parameter: ProcessParameter = {
            Name: name,
            Type: ProcessVariableType[paramType],
            Prompt: prompt,
            Value: value
        }

        this.parameters.push(parameter);
    }

    removeParameter(name: string) {
        const index = this.parameters.findIndex(p => p.Name === name);
        this.parameters.splice(index, 1);
    }


    constructBody() {
        const body = {};
        body['Name'] = this.name;
        body['HasSecurityAccess'] = this.hasSecurityAccess;
        body['PrologProcedure'] = this.prologProcedure;
        body['MetadataProcedure'] = this.metadataProcedure;
        body['DataProcedure'] = this.dataProcedure;
        body['EpilogProcedure'] = this.epilogProcedure;
        body['UIData'] = this.UIData;
        body['Variables'] = this.variables;
        body['VariablesUIData'] = this.variablesUIData;
        body['Parameters'] = this.parameters;
        body['DataSource'] = {};
        body['DataSource']['Type'] = this.dataSource.Type;
        
        // Create DataSource body based on type
        switch (this.dataSource.Type) {
            case 'None':
                break;
            case 'ASCII':
                body['DataSource']['dataSourceNameForClient'] = this.dataSource.dataSourceNameForClient;
                body['DataSource']['dataSourceNameForServer'] = this.dataSource.dataSourceNameForServer;
                body['DataSource']['asciiDecimalSeparator'] = this.dataSource.asciiDecimalSeparator;
                body['DataSource']['asciiDelimiterChar'] = this.dataSource.asciiDelimiterChar;
                body['DataSource']['asciiDelimiterType'] = this.dataSource.asciiDelimiterType;
                body['DataSource']['asciiHeaderRecords'] = this.dataSource.asciiHeaderRecords;
                body['DataSource']['asciiQuoteCharacter'] = this.dataSource.asciiQuoteCharacter;
                body['DataSource']['asciiThousandSeparator'] = this.dataSource.asciiThousandSeparator;
                if (this.dataSource.asciiDelimiterType == 'FixedWidth') {
                    delete body['DataSource']['asciiDelimiterChar'];
                }
                break;
            case 'ODBC': // TODO
                body['DataSource']['dataSourceNameForClient'] = this.dataSource.dataSourceNameForClient;
                body['DataSource']['dataSourceNameForServer'] = this.dataSource.dataSourceNameForServer;
                body['DataSource']['userName'] = this.dataSource.userName;
                body['DataSource']['password'] = this.dataSource.password;
                body['DataSource']['query'] = this.dataSource.query;
                body['DataSource']['usesUnicode'] = this.dataSource.usesUnicode;
                break;
            case 'TM1DimensionSubset':
                body['DataSource']['dataSourceNameForClient'] = this.dataSource.dataSourceNameForClient;
                body['DataSource']['dataSourceNameForServer'] = this.dataSource.dataSourceNameForServer;
                body['DataSource']['subset'] = this.dataSource.subset;
                break;
            case 'TM1CubeView':
                body['DataSource']['dataSourceNameForClient'] = this.dataSource.dataSourceNameForClient;
                body['DataSource']['dataSourceNameForServer'] = this.dataSource.dataSourceNameForServer;
                body['DataSource']['view'] = this.dataSource.view;
                break;
            default:
                break;
        }
        return body;
    }

}

interface ProcessVariable {
    Name: string;
    Type: ProcessVariableType;
    Position?: number;
    StartByte?: number;
    EndByte?: number;
}

enum ProcessVariableType {
    String = "String",
    Numeric = "Numeric"
}

interface ProcessDataSource {
    Type: "None" | "ASCII" | "ODBC" | "TM1DimensionSubset" | "TM1CubeView";
    dataSourceNameForClient?: string;
    dataSourceNameForServer?: string;
    asciiDecimalSeparator?: string; // Default: .
    asciiDelimiterChar?: string; // Default: ,
    asciiDelimiterType?: "Character" | "FixedWidth"; // Default: Character
    asciiHeaderRecords?: number; // Default: 1
    asciiQuoteCharacter?: string; // Default: "
    asciiThousandSeparator?: string; // Default: ,
    subset?: string;
    view?: string;
    userName?: string;
    password?: string;
    query?: string;
    usesUnicode?: boolean;

}

interface ProcessParameter {
    Name: string;
    Prompt?: string;
    Value?: string | number;
    Type: ProcessVariableType;
}

export default Process;