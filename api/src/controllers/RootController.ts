import { Get, Route, Controller } from "tsoa";

@Route("/")
export class RootController extends Controller {
  @Get("/")
  public async welcomeMessage(): Promise<string> {
    return "Welcome to the API!";
  }
}
