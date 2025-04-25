{
  description = "gimme";

  inputs.nixpkgs.url = "github:NixOs/nixpkgs/nixpkgs-unstable";

  outputs = { self, nixpkgs }: let
    system = "aarch64-darwin"; 
    pkgs = import nixpkgs {
      inherit system;
      config.allowUnfree = true;
    };
  in{
    devShells.${system}.default = pkgs.mkShell {
      buildInputs = with pkgs; [
        deno
        vscode-langservers-extracted
      ];
    };
  };
}
