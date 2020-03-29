exports = function(){
    //retrieve the user ID for function auth user from context
    return context.values.get("function-auth-user");
}