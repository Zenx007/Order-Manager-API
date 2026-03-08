export const ConstantsMessages = {
  Success: 'Operação realizada com sucesso.',
  Error: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
  ErrorUserNotLogged: 'É necessário estar logado para realizar essa ação.',
};

export const ConstantsMessageUser = {
  ErrorGetAll: 'Erro ao buscar todos os usuários',
  ErrorGetById: 'Erro ao buscar usuário pelo id',
  ErrorInsert: 'Erro ao tentar inserir usuário',
  ErrorNotFound: 'Usuário não encontrado',
  ErrorUpdate: 'Erro ao tentar atualizar usuário',
  ErrorDelete: 'Erro ao tentar deletar usuário',
  ErrorPrepare: 'Erro ao preparar dados do usuário',
  ErrorAuthorizeAction: 'Você não tem permissão para realizar esta ação',
  ErrorCheckUser: 'Erro ao checar usuário',
  ErrorExportList: 'Erro ao exportar usuários',
  ErrorAlreadyExists: 'Este e-mail já está cadastrado',
  ErrorLogin: 'E-mail ou senha inválidos',
  ErrorLoginFailed: 'Ocorreu um erro ao realizar o login',

  SuccessInsert: 'Sucesso ao salvar usuário',
  SuccessPrepare: 'Sucesso ao preparar usuário',
  SuccessDelete: 'Sucesso ao deletar usuário',
  SuccessGetAll: 'Sucesso ao buscar todos os usuários',
  SuccessLogin: 'Sucesso ao realizar o login',
  SuccessGetInfo: 'Sucesso ao buscar dados do usuário',
  SuccessUpdate: 'Usuário atualizado com sucesso',
  SuccessDeleteSelf: 'Sua conta foi deletada com sucesso',
  SuccessUpdateSelf: 'Seus dados foram atualizados com sucesso',
  SuccessPromote: 'Usuário promovido com sucesso',
  SuccessDemote: 'Permissões removidas com sucesso',

  ErrorGetInfo: 'Erro ao buscar dados do usuário',
  ErrorDeleteSelf: 'Erro ao deletar sua conta',
  ErrorUpdateSelf: 'Erro ao atualizar seus dados',
  ErrorPromote: 'Erro ao promover usuário',
  ErrorDemote: 'Erro ao remover permissões',
  ErrorGetAllUsers: 'Erro ao listar usuários',
  ErrorPasswordNotMatch: 'A nova senha e a confirmação não conferem.',
  ErrorPasswordIncorrect: 'Senha atual incorreta.',
  ErrorPasswordUpdate: 'Erro ao atualizar a senha.',
  ErrorPasswordUnexpected: 'Erro inesperado ao alterar a senha.',
  SuccessPasswordUpdate: 'Senha alterada com sucesso',
};

export const ConstantsMessageOrder = {
  ErrorGetAll: 'Erro ao buscar todos os pedidos',
  ErrorGetById: 'Erro ao buscar pedido pelo id',
  ErrorInsert: 'Erro ao tentar inserir pedido',
  ErrorNotFound: 'Pedido não encontrado',
  ErrorUpdate: 'Erro ao tentar atualizar pedido',
  ErrorDelete: 'Erro ao tentar deletar pedido',
  ErrorUnauthorizedView: 'Você não tem permissão para ver este pedido.',
  ErrorUnauthorizedUpdate: 'Você só pode atualizar seus próprios pedidos.',
  ErrorUnauthorizedDelete: 'Você só pode deletar seus próprios pedidos.',
  ErrorGetMyOrders: 'Erro ao listar seus pedidos',
  ErrorInsertItems: 'Pedido criado, mas falha ao salvar itens.',
  ErrorIdItemDuplicated:
    'Um pedido não pode conter o mesmo item (productId) mais de uma vez.',
  ErrorOrderIdAlreadyExists: 'Já existe um pedido com este número.',
  ErrorOrderIdCannotBeChanged: 'O número do pedido não pode ser alterado.',

  SuccessInsert: 'Sucesso ao salvar pedido',
  SuccessUpdate: 'Sucesso ao atualizar pedido',
  SuccessDelete: 'Sucesso ao deletar pedido',
  SuccessGetAll: 'Sucesso ao buscar todos os pedidos',
  SuccessGetById: 'Pedido encontrado com sucesso',
  SuccessGetMyOrders: 'Seus pedidos foram listados com sucesso',
};

export const ConstantsMessageItem = {
  ErrorInsert: 'Erro ao inserir item do pedido',
  ErrorInsertMany: 'Erro ao inserir itens do pedido',
  ErrorDeleteByOrder: 'Erro ao deletar itens do pedido',
  ErrorFindByOrder: 'Erro ao buscar itens do pedido',
};
