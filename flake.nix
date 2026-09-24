{
  description = "gimme";

  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-26.05";

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
        nodejs_26
        vscode-langservers-extracted
      ];
    };
  };
}
