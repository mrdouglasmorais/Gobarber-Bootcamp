import User from '../models/User';
import * as Yup from 'yup'
/*
Esta sintaxe de importação do yup se da por conta da
lib que não tem um export default
*/
class UserController {
  async store(req, res) {
    //A seguir validation schema para criação de usuários

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6)
    })
    if (!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Validation fails'})
    } //Final do if condition.
    // validação para cadastro de usuários;

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const { name, email, provider } = await User.create(req.body);

    return res.json({
      name,
      email,
      provider,
    });
  }

  async update(req, res) {

    // Validações para cadastro de usuários
    const schema = Yup.object().shape({
      name: Yup.string(),
      oldPassword: Yup.string().min(6),
      password: Yup.string().min(6).when('oldPassword', (oldPassword, field) =>
      oldPassword ? field.required() : field),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref(password)]) : field)
    })
    /*
    When condição de validação para os campos;
    Se na atualização for informado a senha antiga, o mesmo precisa informar
    a senha nova ou seha o campo se torna obrgatório.
    */

    if (!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Validation fails'})
    } //Final do if condition.

    const { email, oldPassword } = req.body

    const user = await User.findByPk(req.userId)

    if(email !== user.email){
      const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists.' });
      } //Fecha o if condition
    }
    /*
    Temos uma função async para atualizar os dados de nossos usuários

    Verificação se o email informado no corpo da requisição não conferir com
    o email de cacdastro, teremos um erro como resposta, acima temos um if de
    dupla condição trabalando com dadoss asincronos.

    Primeira condição, veridfica se o email existe na base, sendo ele dado único
    se o mesmo existir na base ele impede o cadastro de um novo usuário com o
    mesmo e-mail.

    */

    if(oldPassword && !(await user.checkPassword(oldPassword))){
      return res.status(401).json({ error: 'Password does not match' });
    } //Fecha o if condition

    /*
    Verificação se o oldPassword for informado e se o mesmo não onferir,
    retorna erro 401 ({ messege: 'Password is not match'})
    */

    const { id, name, provider } = await user.update(req.body);
    // atualiza os dados da constante;

    return res.json({ id , name, email, provider });
    // Retorno de dados
  }
}

export default new UserController();
